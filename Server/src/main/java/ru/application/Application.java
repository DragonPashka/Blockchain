package ru.application;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(SpringBootApplicationConfiguration.class)
public class Application extends SpringBootServletInitializer
{
    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }
}
