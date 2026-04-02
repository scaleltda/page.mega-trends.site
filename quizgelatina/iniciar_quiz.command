#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
echo "Iniciando servidor local do quiz..."
open "http://localhost:8000"
python3 -m http.server 8000
