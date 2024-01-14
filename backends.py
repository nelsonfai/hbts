
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from accounts.models import CustomUser

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, email_or_phone=None, password=None, **kwargs):
        UserModel = CustomUser
        try:
            user = UserModel.objects.get(email=email_or_phone)
        except UserModel.DoesNotExist:
            try:
                user = UserModel.objects.get(phonenumber=email_or_phone)
            except UserModel.DoesNotExist:
                return None
        if user.check_password(password):
            return user
        return None
