package ru.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.chain.Block;
import ru.responses.ResponseJson;


import static org.hamcrest.core.Is.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static ru.chain.Chain.blocks;

@RunWith(MockitoJUnitRunner.class)
public class FileUploadControllerTest
{
    private MockMvc mockMvc;

    @Mock
    private FileUploadService fileUploadService;

    @InjectMocks
    private FileUploadController fileUploadController=new FileUploadController();

    private byte[] bytes = {1, 2, 3};

    @Before
    public void setUp() throws Exception
    {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(fileUploadController).build();
        fileUploadController.setResponseJson(new ResponseJson());
    }

    @Test
    public void testUploadNewFile() throws Exception
    {
        when(fileUploadService.createHashFromFile(any())).thenReturn("123");
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/upload")
                        .file("file", bytes)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.state", is("Success")));
    }
    @Test
    public void testUploadUploadedFile() throws Exception
    {
        blocks.add(new Block("Block 0", "0", "123"));
        when(fileUploadService.createHashFromFile(any())).thenReturn("123");
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/upload")
                .file("file", bytes)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.state", is("Failure! This file has already added")));
    }

    @Test
    public void testUploadEmptyFile() throws Exception
    {
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/upload")
                .file("file", new byte[0])
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.state", is("Failure! This file is empty")));
    }




}
