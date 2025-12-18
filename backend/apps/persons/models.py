from django.db import models


class Address(models.Model):
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)

    address_line = models.CharField(max_length=255, blank=True, null=True)
    address_line_extra = models.CharField(max_length=255, blank=True, null=True)

    state = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=32, blank=True, null=True)
    area = models.CharField(max_length=255, blank=True, null=True)

    dadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "addresses"

    def __str__(self):
        return f"{self.country}, {self.city}"


class Person(models.Model):
    last_name = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)

    full_name = models.CharField(max_length=512)

    photo = models.CharField(max_length=512, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    registration_address = models.ForeignKey(
        Address,
        related_name="registered_persons",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    actual_address = models.ForeignKey(
        Address,
        related_name="actual_persons",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    sex = models.IntegerField(blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "persons"

    def save(self, *args, **kwargs):
        self.full_name = " ".join(
            filter(None, [self.last_name, self.first_name, self.middle_name])
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name
