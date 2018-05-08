package ru.application;

import org.junit.runner.RunWith;
import org.springframework.boot.SpringApplication;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@TestPropertySource(locations="classpath:test.properties")

public class ApplicationTest
{
    public static void main(String[] args)
    {
        SpringApplication.run(ApplicationTest.class, args)  ;
    }
}
