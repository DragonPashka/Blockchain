package ru.chain;

import lombok.extern.slf4j.Slf4j;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

@Slf4j
public class Chain
{
    private static ArrayList<Block> blocks = new ArrayList<Block>();

    public static Boolean isChainValid() throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        Block currentBlock;
        Block previousBlock;

        //loop through blockchain to check hashes:
        for (int i = 1; i < blocks.size(); i++)
        {
            currentBlock = blocks.get(i);
            previousBlock = blocks.get(i - 1);
            //compare registered hash and calculated hash:
            if (!currentBlock.getHash().equals(currentBlock.calculateHash()))
            {
                log.info("Current Hashes not equal");
                return false;
            }
            //compare previous hash and registered previous hash
            if (!previousBlock.getHash().equals(currentBlock.getPreviousHash()))
            {
                log.info("Previous Hashes not equal");
                return false;
            }
        }
        return true;
    }

    public static Boolean isFileAdded(String hashFile) throws UnsupportedEncodingException, NoSuchAlgorithmException
    {
        for (Block block: blocks)
        {
            if(block.getHash().equals(hashFile))
                return true;
        }
        return false;
    }
}
