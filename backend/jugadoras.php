<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    $conn = new mysqli("localhost", "root", "root123", "mujeres diversas mexico");
    //AQUI TIENEN QUE PONER LA INFORMACIÓN DE SU LOCALHOST PARA QUE CONECTEN A LA BASE DE

    if ($conn->connect_error) {
        exit;
    }

    $conn->set_charset("utf8");

    $equipo = $data['equipo'] ?? '';
    $tabla = "";
    $prefijo = "";

    switch ($equipo) {
        case "queer-goals":
            $tabla = "queer goals";
            $prefijo = "QG";
            break;
        case "valquirias":
            $tabla = "valquirias";
            $prefijo = "VA";
            break;
        case "good-vibes":
            $tabla = "good vibes";
            $prefijo = "GV";
            break;
        case "all-stars-gv":
            $tabla = "all stars gv";
            $prefijo = "AS";
            break;
        case "tbd-united":
            $tabla = "tbd united";
            $prefijo = "TU";
            break;
        case "unknown":
            $tabla = "unknown";
            $prefijo = "UN";
            break;
        case "fc-lionesses":
            $tabla = "lionesses";
            $prefijo = "LI";
            break;
        case "bandidas-fc":
            $tabla = "bandidas fc";
            $prefijo = "BF";
            break;
        case "real-madrid":
            $tabla = "real madrid";
            $prefijo = "RM";
            break;
        case "fenix-fc":
            $tabla = "fenix fc";
            $prefijo = "FF";
            break;
        case "lobas-mexico":
            $tabla = "lobas mexico";
            $prefijo = "LM";
            break;
        default:
            $conn->close();
            exit;
    }

    switch ($data['accion'] ?? '') {
        case "listar":
            $query = "SELECT Numero, `Nombre Completo`, Edad, Posicion, Playera FROM `$tabla` ORDER BY Numero ASC";
            $res = $conn->query($query);
            $resultados = [];
            if ($res) {
                while ($row = $res->fetch_assoc()) {
                    $resultados[] = $row;
                }
            }
            echo json_encode($resultados);
            break;

        case "agregar":
            $nombre = $data['nombreCompleto'] ?? '';
            $edad = (int)($data['edad'] ?? 0);
            $posicion = $data['posicion'] ?? '';
            $playera = (int)($data['playera'] ?? 0);

            $resTotal = $conn->query("SELECT COUNT(*) AS total FROM `$tabla`");
            $filaTotal = $resTotal->fetch_assoc();
            $siguiente = $filaTotal['total'] + 1;

            if ($siguiente < 10) {
                $numeroId = $prefijo . "0" . $siguiente;
            } else {
                $numeroId = $prefijo . $siguiente;
            }

            $query = "INSERT INTO `$tabla` (Numero, `Nombre Completo`, Edad, Posicion, Playera) 
                      VALUES ('$numeroId', '$nombre', $edad, '$posicion', $playera)";

            if ($conn->query($query)) {
                echo json_encode([
                    "Numero" => $numeroId,
                    "Nombre Completo" => $nombre,
                    "Edad" => $edad,
                    "Posicion" => $posicion,
                    "Playera" => $playera
                ]);
            }
            break;
    }

    $conn->close();

} catch (Throwable $e) {}
?>