#!/bin/bash

echo "🧪 Probando API de login..."

# Función para probar login
test_login() {
    local code=$1
    local pin=$2
    local name=$3
    
    echo "🔐 Probando login: $code ($name)"
    response=$(curl -s -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"employee_code\": \"$code\", \"pin\": \"$pin\"}")
    
    if echo "$response" | grep -q "success.*true"; then
        echo "   ✅ Login exitoso para $code"
        echo "   📄 Respuesta: $(echo $response | jq -r '.employee.first_name + " " + .employee.last_name + " (" + .employee.role + ")"' 2>/dev/null || echo $response)"
    else
        echo "   ❌ Login falló para $code"
        echo "   📄 Respuesta: $response"
    fi
    echo ""
}

# Probar las 4 credenciales
test_login "EMP001" "1234" "Ana García"
test_login "EMP002" "1234" "Carlos López" 
test_login "SUP001" "1234" "María Rodríguez"
test_login "ADM001" "1234" "Juan Martínez"

# Probar credencial incorrecta
test_login "EMP999" "0000" "Usuario inválido"

echo "🎯 Pruebas completadas"