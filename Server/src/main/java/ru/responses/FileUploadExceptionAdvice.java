package ru.responses;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import ru.controller.FileUploadController;

import static ru.chain.Chain.blocks;

/**
 * Class for handling errors
 * @author Pozdnyakov Pavel
 */
@Slf4j
@ControllerAdvice
public class FileUploadExceptionAdvice
{
    @Autowired
    private ResponseJson responseJson;
    /**
     * handler exception
     *
     * @param ex error
     * @return Json document and request's status
     */
    @ExceptionHandler({Exception.class})
    public ResponseEntity<ResponseJson> handleException(Exception ex)
    {
        log.error(ex.toString());

        if (ex instanceof MaxUploadSizeExceededException)
        {
            responseJson.setState("Failure! This file is too big. " + ex.toString());
            responseJson.setHash(null);
            return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.OK);
        }
        responseJson.setState("Error " + ex);
        responseJson.setHash(null);
        if (blocks.size() - FileUploadController.size == 1)
            blocks.remove(FileUploadController.size);
        return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.FORBIDDEN);
    }
}
