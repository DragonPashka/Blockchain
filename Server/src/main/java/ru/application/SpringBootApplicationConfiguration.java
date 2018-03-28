package ru.application;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"ru.controllers","ru.responses" })
public class SpringBootApplicationConfiguration
{
}
