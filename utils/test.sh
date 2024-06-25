#!/bin/bash

 curl -H "Content-Type: application/json" -X POST http://127.0.0.1:8000/accounts/signup -d @sample_signup.json
 curl -H "Content-Type: application/json" -X POST http://127.0.0.1:8000/accounts/login -d @sample_login.json