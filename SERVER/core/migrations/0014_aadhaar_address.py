# Generated by Django 4.1 on 2022-08-25 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0013_aadhaar"),
    ]

    operations = [
        migrations.AddField(
            model_name="aadhaar",
            name="address",
            field=models.CharField(default=None, max_length=250),
            preserve_default=False,
        ),
    ]
