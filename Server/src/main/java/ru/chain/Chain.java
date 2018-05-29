package ru.chain;

import lombok.extern.slf4j.Slf4j;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
/**
 * Class for saving a block
 * @author Pozdnyakov Pavel
 */
@Slf4j
public class Chain
{
    public static ArrayList<Block> blocks = new ArrayList<Block>();
    public static int difficulty = 5;

    /**
     * added file early or not
     * @param hashFile hash of file what need to check
     * @return true if added file early else false
     * @throws UnsupportedEncodingException error if the system unsupported this encoding
     * @throws NoSuchAlgorithmException error if algoritm of hash is not valid
     */
    public static Boolean isFileAdded(String hashFile) throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        for (Block block: blocks)
        {
            if(block.getHashFile().equals(hashFile))
                return true;
        }
        return false;
    }
}
