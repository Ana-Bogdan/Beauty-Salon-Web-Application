from fastapi import Depends, HTTPException
from .auth import get_current_user


def require_admin(user = Depends(get_current_user)):
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admins only")
    return user
