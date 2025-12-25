from rest_framework import serializers
from .models import Person, Address


# =========================
# ADDRESS
# =========================

class AddressSerializer(serializers.ModelSerializer):
    # 🔴 ЕДИНСТВЕННАЯ ВАЛИДАЦИЯ ВО ВСЕЙ СИСТЕМЕ
    address_line = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
    )

    # 🟢 ВСЁ ОСТАЛЬНОЕ — НЕ ОБЯЗАТЕЛЬНО
    country = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address_line_extra = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    state = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    zipcode = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    area = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    dadata = serializers.JSONField(required=False, allow_null=True)

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


# =========================
# PERSON
# =========================

class PersonSerializer(serializers.ModelSerializer):
    # вложенные адреса
    registration_address = AddressSerializer(required=False, allow_null=True)
    actual_address = AddressSerializer(required=False, allow_null=True)

    # id-варианты
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

    # =========================
    # INTERNAL
    # =========================

    def _upsert_address(self, addr_data, instance: Address | None) -> Address | None:
        """
        addr_data:
        - None → ничего не делаем
        - dict → create / update
        """
        if addr_data is None:
            return None

        if not isinstance(addr_data, dict):
            raise serializers.ValidationError("Address must be an object")

        if instance is None:
            return Address.objects.create(**addr_data)

        for key, value in addr_data.items():
            setattr(instance, key, value)

        instance.save()
        return instance

    # =========================
    # CREATE
    # =========================

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

    # =========================
    # UPDATE
    # =========================

    def update(self, instance, validated_data):
        reg_addr_data = validated_data.pop("registration_address", None)
        act_addr_data = validated_data.pop("actual_address", None)

        # обычные поля
        for key, value in validated_data.items():
            setattr(instance, key, value)

        # адреса
        if reg_addr_data is not None:
            instance.registration_address = self._upsert_address(
                reg_addr_data,
                instance.registration_address,
            )

        if act_addr_data is not None:
            instance.actual_address = self._upsert_address(
                act_addr_data,
                instance.actual_address,
            )

        instance.save()
        return instance
