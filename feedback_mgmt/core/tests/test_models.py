#!/usr/bin/env python3

import pytest
from core.models import User

@pytest.mark.django_db
def test_create_user():
    user = User.obje
