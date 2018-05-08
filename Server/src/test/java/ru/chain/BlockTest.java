package ru.chain;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BlockTest
{
    private Block block;

    @Before
    public void setUp() throws Exception
    {
       block=new Block("123", "0", "1");
    }


    @Test
    public void testSameHashFromSamBlock() throws IOException, NoSuchAlgorithmException
    {
        Block b=new Block(block.getData(), block.getPreviousHash(), block.getHashFile());
        b.setTimeStamp(block.getTimeStamp());
        assertEquals(b.calculateHash(), block.calculateHash());
    }

    @Test
    public void testDifficultOfHash() throws IOException, NoSuchAlgorithmException
    {
        int difficult=4;
        block.mineBlock(difficult);
        for (int i=0; i<difficult; i++)
        {
            assertEquals(block.getHash().charAt(i),'0');
        }

    }


}
