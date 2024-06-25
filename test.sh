#!/bin/bash

 curl -H "Content-Type: application/json" -X POST http://127.0.0.1:8000/accounts/signup -d @utils/sample_signup.json
 curl -H "Content-Type: application/json" -X POST http://127.0.0.1:8000/accounts/login -d @utils/sample_login.json