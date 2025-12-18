from rest_framework import serializers
from .models import Person, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "country",
            "city",
            "address_line",
            "address_line_extra",
            "state",
            "zipcode",
            "area",
            "dadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PersonSerializer(serializers.ModelSerializer):
    # В ответе отдаём вложенные адреса (удобно для UI)
    registration_address = AddressSerializer(required=False, allow_null=True)
    actual_address = AddressSerializer(required=False, allow_null=True)

    # И одновременно принимаем *_id (удобно для простых апдейтов)
    registration_address_id = serializers.PrimaryKeyRelatedField(
        source="registration_address",
        queryset=Address.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )
    actual_address_id = serializers.PrimaryKeyRelatedField(
        source="actual_address",
        queryset=Address.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Person
        fields = [
            "id",
            "last_name",
            "first_name",
            "middle_name",
            "full_name",
            "photo",
            "email",
            "registration_address",
            "actual_address",
            "registration_address_id",
            "actual_address_id",
            "sex",
            "birthday",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "full_name", "created_at", "updated_at"]

    def _upsert_address(self, addr_data, instance: Address | None) -> Address | None:
        """
        addr_data может быть:
        - None => вернуть None (адрес не задан)
        - dict => создать/обновить Address
        """
        if addr_data is None:
            return None

        if not isinstance(addr_data, dict):
            # если пришло не dict (например, строка) — это некорректный формат
            raise serializers.ValidationError("Address must be an object")

        if instance is None:
            return Address.objects.create(**addr_data)

        for k, v in addr_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance

    def create(self, validated_data):
        reg_addr_data = validated_data.pop("registration_address", None)
        act_addr_data = validated_data.pop("actual_address", None)

        person = Person.objects.create(**validated_data)

        if reg_addr_data is not None:
            person.registration_address = self._upsert_address(reg_addr_data, None)
        if act_addr_data is not None:
            person.actual_address = self._upsert_address(act_addr_data, None)

        person.save()
        return person

    def update(self, instance, validated_data):
        reg_addr_data = validated_data.pop("registration_address", None)
        act_addr_data = validated_data.pop("actual_address", None)

        # обычные поля
        for k, v in validated_data.items():
            setattr(instance, k, v)

        # вложенные адреса (если переданы объектом)
        if reg_addr_data is not None:
            instance.registration_address = self._upsert_address(
                reg_addr_data, instance.registration_address
            )
        if act_addr_data is not None:
            instance.actual_address = self._upsert_address(
                act_addr_data, instance.actual_address
            )

        instance.save()
        return instance
