package ru.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import ru.responses.ResponseJson;

@SpringBootApplication
@ComponentScan(basePackages = {"ru.controller","ru.responses" ,"ru.chain"})
public class ApplicationTest
{
    public static void main(String[] args)
    {
        SpringApplication.run(ApplicationTest.class, args)  ;
    }

}
