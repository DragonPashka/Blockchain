package ru.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.responses.ResponseJson;

import javax.xml.bind.DatatypeConverter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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
    public ResponseEntity<ResponseJson> uploadFile(@RequestParam("file") MultipartFile file) throws IOException, NoSuchAlgorithmException
    {
        log.info("The post request:");
        String hash=createHash(file.getBytes());
        responseJson.setState("Success");
        responseJson.setHash(hash);
        log.info("Successfully uploaded and created hash the file");
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
        responseJson.setHash(null);
        return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.FORBIDDEN);
    }

    public static String createHash(byte[] bytes) throws NoSuchAlgorithmException
    {
        MessageDigest complete = MessageDigest.getInstance("SHA-256");
        byte[] hash=complete.digest(bytes);
        StringBuffer hexString = new StringBuffer();

        for (int i = 0; i < hash.length; i++)
        {
            String hex = Integer.toHexString(0xff & hash[i]);
            if(hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();

    }
}

