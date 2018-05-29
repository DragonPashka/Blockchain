package ru.application;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Class for scanning configuration
 * @author Pozdnyakov Pavel
 */

@Configuration
@ComponentScan(basePackages = {"ru.controller","ru.responses" ,"ru.chain"})
public class SpringBootApplicationConfiguration
{
}
