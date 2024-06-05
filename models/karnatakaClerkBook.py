from pydantic import BaseModel, Field
from typing import List

class Clerk(BaseModel):
    clerk_id: str
    name: str
    mobile_number: str
    availability_time: str
    rating: float

class Office(BaseModel):
    office_id: str
    location: str
    clerks: List[Clerk]

class Department(BaseModel):
    department_id: str
    name: str
    offices: List[Office]

class City(BaseModel):
    city_id: str
    name: str
    departments: List[Department]

class State(BaseModel):
    state_id: str
    name: str
    cities: List[City]

class Country(BaseModel):
    country_id: str
    name: str
    states: List[State]

class CountryList(BaseModel):
    items: List[Country]
