# Generated by Django 4.1 on 2022-08-25 12:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0010_alter_order_status_shiftcashcollection"),
    ]

    operations = [
        migrations.CreateModel(
            name="Feedback",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("order_uuid", models.CharField(max_length=128)),
                ("user_paid_amount", models.PositiveBigIntegerField()),
                ("stars", models.IntegerField()),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
