// Función para calcular las operaciones
function calcular() {
    // Obtener los valores ingresados
    var num1 = document.getElementById("numero1").value;
    var num2 = document.getElementById("numero2").value;
    
    // Convertir a números
    num1 = Number(num1);
    num2 = Number(num2);
    
    // Verificar si los campos están vacíos
    if (num1 == "" || num2 == "") {
        alert("Por favor ingrese ambos números");
        return;
    }
    
    // Crear variable para guardar los resultados
    var mensaje = "";
    
    // Realizar las 5 iteraciones
    for (var i = 1; i <= 5; i++) {
        if (i == 1) {
            // Primera iteración: SUMA
            var resultado = num1 + num2;
            mensaje = mensaje + "Iteración " + i + ": SUMA = " + resultado + "<br>";
        }
        
        if (i == 2) {
            // Segunda iteración: RESTA
            var resultado = num1 - num2;
            mensaje = mensaje + "Iteración " + i + ": RESTA = " + resultado + "<br>";
        }
        
        if (i == 3) {
            // Tercera iteración: MULTIPLICACIÓN
            var resultado = num1 * num2;
            mensaje = mensaje + "Iteración " + i + ": MULTIPLICACIÓN = " + resultado + "<br>";
        }
        
        if (i == 4) {
            // Cuarta iteración: DIVISIÓN
            var resultado = num1 / num2;
            mensaje = mensaje + "Iteración " + i + ": DIVISIÓN = " + resultado + "<br>";
        }
        
        if (i == 5) {
            // Quinta iteración: MÓDULO
            var resultado = num1 % num2;
            mensaje = mensaje + "Iteración " + i + ": MÓDULO = " + resultado + "<br>";
        }
    }
    
    // Mostrar los resultados
    document.getElementById("resultados").innerHTML = mensaje;
}