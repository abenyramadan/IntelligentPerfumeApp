"backend api routes/endpoints"

user_endpoints = [
    {"method": "POST", "url": "/users", "description": "Create user"},
    {"method": "GET", "url": "/users", "description": "Get all users"},
    {"method": "GET", "url": "/users/user_id", "description": "Get user with given id"},
    {"method": "PUT", "url": "/users/user_id", "description": "Update user"},
    {"method": "DELETE", "url": "/users/user_id", "description": "Delete user"},
]


perfume_endpoints = [
    {"method": "POST", "url": "/perfumes", "description": "Create perfume"},
    {"method": "GET", "url": "/perfumes", "description": "Get all perfumes"},
    {
        "method": "GET",
        "url": "/perfumes/perfume_id",
        "description": "Get perfume with given id",
    },
    {"method": "PUT", "url": "/perfumes/perfume_id", "description": "Update perfume"},
    {
        "method": "DELETE",
        "url": "/perfumes/perfume_id",
        "description": "Delete perfume",
    },
]
