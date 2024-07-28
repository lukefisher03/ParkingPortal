#!/bin/bash

echo "TEST STARTED"
cd ../api/
rm master.db
python3 construct_db.py

cd ../tests/
python3 test_api.py
