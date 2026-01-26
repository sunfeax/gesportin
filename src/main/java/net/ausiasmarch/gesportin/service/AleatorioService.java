package net.ausiasmarch.gesportin.service;

import org.springframework.stereotype.Service;

@Service
public class AleatorioService {

    public int generarNumeroAleatorioEnteroEnRango(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    public double generarNumeroAleatorioDecimalEnRango(double min, double max) {
        return Math.round((Math.random() * (max - min) + min) * 100.0) / 100.0;
    }
    
    public String eliminarAcentos(String input) {
        String[][] acentos = {
            {"á", "a"}, {"é", "e"}, {"í", "i"}, {"ó", "o"}, {"ú", "u"},
            {"Á", "A"}, {"É", "E"}, {"Í", "I"}, {"Ó", "O"}, {"Ú", "U"},
            {"ñ", "ny"}, {"Ñ", "NY"}
        };
        for (String[] par : acentos) {
            input = input.replace(par[0], par[1]);
        }
        return input;
    }

}
