package ru.chain;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import ru.controllers.FileUploadController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Getter
@Setter
@Slf4j
public class Block
{
    private String hash;
    private String previousHash;

    private String data;

    private String hashFile;

    private long timeStamp;

    private int nonce;

    public Block(String data, String previousHash, String hashFile) throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        this.data = data;
        this.previousHash = previousHash;
        this.timeStamp = new Date().getTime();
        this.hashFile = hashFile;
        this.hash = calculateHash();
    }

    public String calculateHash() throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        String calculateHash = FileUploadController.createHash((previousHash + Long.toString(timeStamp) +
                Integer.toString(nonce) + data + hashFile).getBytes("UTF-8"));

        return calculateHash;
    }

    public void mineBlock(int difficulty) throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        String target = new String(new char[difficulty]).replace('\0', '0');
        while (!hash.substring(0, difficulty).equals(target))
        {
            nonce++;
            hash = calculateHash();
        }
        log.info("Block Mined!!! : " + hash);
    }
}
