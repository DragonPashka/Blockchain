package ru.controller;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Class for createtin a hash from file and string
 * @author Pozdnyakov Pavel
 */
@Service
public class FileUploadService
{
    /**
     * create hash from file
     *
     * @param name - name of file, for creating hash
     * @return the string of hash
     * @throws NoSuchAlgorithmException error if algoritm of hash is not valid
     * @throws IOException error if file not exist
     */
    public String createHashFromFile(String name) throws NoSuchAlgorithmException, IOException
    {
        Path path = Paths.get(name);
        return createHashFromByte(Files.readAllBytes(path));
    }

    /**
     * create hash from bytes
     *
     * @param bytes - data for creating hash
     * @return the string of hash
     * @throws NoSuchAlgorithmException error if algoritm of hash is not valid
     */

    public String createHashFromByte(byte[] bytes) throws NoSuchAlgorithmException
    {
        MessageDigest complete = MessageDigest.getInstance("SHA-256");
        byte[] hash = complete.digest(bytes);
        StringBuffer hexString = new StringBuffer();

        for (int i = 0; i < hash.length; i++)
        {
            String hex = Integer.toHexString(0xff & hash[i]);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();

    }
}
