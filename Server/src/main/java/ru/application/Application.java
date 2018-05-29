package ru.application;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

/**
 * Class for run apllication
 * @author Pozdnyakov Pavel
 */
@SpringBootApplication
@Import(SpringBootApplicationConfiguration.class)
public class Application
{
    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }
}
