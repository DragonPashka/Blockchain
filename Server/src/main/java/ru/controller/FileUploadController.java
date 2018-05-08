package ru.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.chain.Block;
import ru.chain.Chain;
import ru.responses.ResponseJson;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import static ru.chain.Chain.blocks;

/**
 * @author Pozndyakov Pavel
 */
@Slf4j
@RestController
@RequestMapping("/upload")
public class FileUploadController
{
    private static int size = -5;

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

        if (!file.isEmpty())
        {
            byte[] bytes = file.getBytes();
            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File("uploaded")));
            stream.write(bytes);
            stream.close();
            File upload = new File("uploaded");
            String hash = FileUploadService.createHashFromFile("uploaded");
            size = blocks.size();
            if (!Chain.isFileAdded(hash))
            {
                responseJson.setState("Success");
                responseJson.setHash(hash);
                if (size == 0)
                {
                    blocks.add(new Block("Block 0", "0", hash));
                }
                else
                {
                    blocks.add(new Block(Integer.toString(size), blocks.get(size - 1).getHash(), hash));
                }
                blocks.get(size).mineBlock(Chain.difficulty);

                log.info("Successfully uploaded and created hash the file");

                upload.delete();
                return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.OK);
            }
            else
            {
                responseJson.setState("Failure! This file has already added");
                responseJson.setHash(null);
                upload.delete();
                return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.OK);
            }
        }

        responseJson.setState("Failure! This file is empty");
        responseJson.setHash(null);
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
        responseJson.setState("Error " + ex);
        log.error(ex.toString());
        responseJson.setHash(null);
        if (blocks.size() - size == 1)
            blocks.remove(size);
        return new ResponseEntity<ResponseJson>(responseJson, HttpStatus.FORBIDDEN);
    }
}

