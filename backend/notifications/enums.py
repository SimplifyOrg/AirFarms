from enum import Enum

class EventStatus(Enum):
    active = 'Active'
    disabled = 'Disabled'

class TimeInterval(Enum):
    one_min = '1 min'
    five_mins = '5 mins'
    one_hour = '1 hour'