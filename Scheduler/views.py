from django.shortcuts import render_to_response


def index(request):
    return render_to_response('index.html')

def view_calendar(request):
    return render_to_response('calendar.html')

