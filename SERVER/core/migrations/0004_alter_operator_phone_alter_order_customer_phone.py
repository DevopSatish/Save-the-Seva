# Generated by Django 4.1 on 2022-08-21 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_operator_phone"),
    ]

    operations = [
        migrations.AlterField(
            model_name="operator",
            name="phone",
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name="order",
            name="customer_phone",
            field=models.PositiveIntegerField(),
        ),
    ]
