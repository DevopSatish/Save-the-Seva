# Generated by Django 4.1 on 2022-08-21 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_alter_operator_phone_alter_order_customer_phone"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="operator",
            name="phone",
        ),
        migrations.AddField(
            model_name="operator",
            name="email_id",
            field=models.EmailField(default=None, unique=True),
            preserve_default=False,
        ),
    ]
