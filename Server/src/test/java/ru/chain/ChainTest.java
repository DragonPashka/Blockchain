package ru.chain;

import org.junit.Before;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static junit.framework.TestCase.assertFalse;
import static junit.framework.TestCase.assertTrue;

@SpringBootTest
public class ChainTest
{
    private Block block;

    private String addedFile="2";

    @Before
    public void setUp() throws Exception
    {
        block=new Block("123", "0", "1");
        Chain.blocks.add(block);
        block=new Block("1234", "1", addedFile);
        Chain.blocks.add(block);
        block=new Block("12345", "3", "4");
        Chain.blocks.add(block);
    }

    @Test
    public void testAddedFile() throws Exception
    {
        assertTrue(Chain.isFileAdded(addedFile));
    }

    @Test
    public void testNotAddedFile() throws Exception
    {
        assertFalse(Chain.isFileAdded("not"));
    }


}
