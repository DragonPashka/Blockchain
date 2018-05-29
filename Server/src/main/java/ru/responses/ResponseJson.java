package ru.responses;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

/**
 * Class of returning value from request
 * @author Pozdnyakov Pavel
 */
@Getter
@Setter
@Component
public class ResponseJson
{
    private String state;

    private String hash;
}
