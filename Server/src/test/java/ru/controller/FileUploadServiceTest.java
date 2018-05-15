package ru.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mock;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@RunWith(PowerMockRunner.class)
public class FileUploadServiceTest
{
    private byte[] bytes = {1, 2, 3};

    private FileUploadService fileUploadService;

    private Path path;


    @Before
    public void setUp() throws Exception
    {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testHashFromFile() throws IOException, NoSuchAlgorithmException
    {
        fileUploadService =mock(FileUploadService.class);
        path=mock(Path.class);
        mockStatic(Paths.class);
        mockStatic(Files.class);

        when(Paths.get(any())).thenReturn(path);
        when(Files.readAllBytes(any())).thenReturn(bytes);
        assertEquals(fileUploadService.createHashFromFile("123"), fileUploadService.createHashFromByte(bytes));
        PowerMockito.verifyStatic();
    }

    @Test(expected = NoSuchFileException.class)
    public void testWhenFileIsNotExist() throws IOException, NoSuchAlgorithmException
    {
        fileUploadService=new FileUploadService();
        assertEquals(fileUploadService.createHashFromFile("123"), fileUploadService.createHashFromByte(bytes));
    }


}
