package ru.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.responses.ResponseJson;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * @author Pozndyakov Pavel
 */
@Slf4j
@RestController
@RequestMapping("/upload")
public class FileUploadController
{
    @Autowired
    private ResponseJson responseJson;

    /**
     * Post request. It is upload a file to the server
     *
     * @param file It is a object which we want to upload to server
     * @return Json document and request's status
     * @throws IOException Error if we couldn't upload the file
     */

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseJson> uploadFile(@RequestParam("file") MultipartFile file) throws IOException
    {
        File convertFile = new File("src/main/" + file.getOriginalFilename());
        convertFile.createNewFile();
        FileOutputStream outputStream = new FileOutputStream(convertFile);
        outputStream.write(file.getBytes());
        outputStream.close();
        if (!convertFile.delete())
        {
            responseJson.setState("Error. Try to change the name of file");
            responseJson.setHex(null);
            log.error("Cannot delete the file");
            return new ResponseEntity<>(responseJson, HttpStatus.BAD_REQUEST);
        }
        responseJson.setState("Success");
        return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.OK);
    }

    /**
     * handler exception
     *
     * @param ex error
     * @return Json document and request's status
     */
    @ExceptionHandler({IOException.class})
    public ResponseEntity<ResponseJson> handleException(Exception ex)
    {
        responseJson.setState("Error "+ex);
        log.error(ex.toString());
        responseJson.setHex(null);
        return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.FORBIDDEN);
    }

}

