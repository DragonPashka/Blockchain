package ru.chain;

import lombok.Getter;
import lombok.Setter;
import ru.controllers.FileUploadController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Getter
@Setter
public class Block
{
    private String hash;
    private String previousHash;

    private String data;

    private String hashFile;

    private long timeStamp;

    public Block(String data, String previousHash, String hashFile) throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        this.data = data;
        this.previousHash = previousHash;
        this.timeStamp = new Date().getTime();
        this.hashFile = hashFile;
        this.hash=calculateHash();
    }

    public String calculateHash() throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        String calculateHash = FileUploadController.createHash((previousHash + Long.toString(timeStamp) + data + hashFile).getBytes("UTF-8"));
        return calculateHash;
    }
}
