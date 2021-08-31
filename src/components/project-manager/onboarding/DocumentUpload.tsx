import React, { ReactElement, useContext, useState } from 'react';
import {
  Grid,
  Paper,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  DialogActions,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
import { DocumentDataType } from '../../../types/employee/onboarding';
import OnboardingContext, {
  OnboardingContextDataType,
} from '../../../contexts/employee/onboardingContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,

      padding: theme.spacing(5, 10),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      width: '100%',
    },
    checkList: {
      marginBottom: 20,
    },
    button: {
      margin: theme.spacing(1),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    buttonMargin: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  }),
);

// Create a checkbox component, with a given document
const createCheckbox = (document: DocumentDataType, key: number) => {
  return (
    <div key={key}>
      <Checkbox disabled checked={document.files.length !== 0} />
      {document.label}
    </div>
  );
};

// Component to handle Onboarding Document Upload
const DocumentUpload = () => {
  const classes = useStyles();
  // Modal switch
  const [open, setOpen] = useState<boolean>(false);
  // Selected document name from the modal
  const [documentName, setDocumentName] = useState<string>('');
  // The uploaded file list for the current document type
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { documents, addDocument } = useContext<OnboardingContextDataType>(
    OnboardingContext,
  );

  // On upload dialog open
  const handleFileUploadDialogOpen = () => {
    setOpen(true);
  };

  // On upload dialog close
  const handleFileUploadDialogClose = () => {
    setDocumentName('');
    setOpen(false);
  };

  // Handle HTML Select for document name change
  const handleSelectOptionChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const docName = event.target.value as string;
    setDocumentName(docName);
    const files =
      documents[documents.map((doc) => doc.label).indexOf(docName)].files;
    setUploadedFiles([...files]);
  };

  // On files added to the Dropzone
  const onFileAdd = (fileObjects: FileObject[]) => {
    const newFiles = fileObjects.map((fileObject) => fileObject.file);
    const currentDocumentIndex = documents
      .map((doc) => doc.label)
      .indexOf(documentName);
    const currentDocument = documents[currentDocumentIndex];
    // Push the new files with the existing files
    const files: File[] = [...currentDocument.files, ...newFiles];
    onFileChange(files);
  };

  // On file removed from the dropzone
  const onFileRemove = (fileObject: FileObject) => {
    const oldFile = fileObject.file;
    const currentDocumentIndex = documents
      .map((doc) => doc.label)
      .indexOf(documentName);
    const currentDocument = documents[currentDocumentIndex];
    const files: File[] = [...currentDocument.files];
    // Remove the deleted file
    files.splice(files.indexOf(oldFile), 1);
    onFileChange(files);
  };

  // Handle updating the context
  const onFileChange = (files: File[]) => {
    addDocument({
      label: documentName,
      s3FileKeys: [],
      files: [...files],
      documentKey: documentName,
    });
    setUploadedFiles([...files]);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          Note that without the complete submission of the documents, your
          profile will not be processed
        </Grid>
        <Grid container item xs={12} className={classes.checkList}>
          <Paper variant='outlined' className={classes.paper}>
            <Grid container>
              <Grid container item xs={6} direction={'column'}>
                {documents.slice(0, documents.length / 2).map(createCheckbox)}
              </Grid>
              <Grid container item xs={6} direction={'column'}>
                {documents.slice(documents.length / 2).map(createCheckbox)}
              </Grid>
            </Grid>
            <Grid>
              <Button
                variant='contained'
                color='default'
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                size='small'
                onClick={handleFileUploadDialogOpen}>
                Change / Upload Files
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        onClose={handleFileUploadDialogClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        fullWidth
        maxWidth='md'>
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5'>Documents</Typography>
          <IconButton
            aria-label='delete'
            className={classes.closeButton}
            size='small'
            onClick={handleFileUploadDialogClose}>
            <CloseIcon fontSize='inherit' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Paper
            elevation={0}
            style={{
              backgroundColor: '#f2f2f2',
              borderRadius: 0,
              padding: '16px',
            }}>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <Typography gutterBottom color='primary'>
                  Select and upload all required documents
                </Typography>
                <FormControl variant='outlined'>
                  <Select
                    value={documentName}
                    onChange={(e) => handleSelectOptionChange(e)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem value=''>
                      <em>Select Document</em>
                    </MenuItem>
                    {documents.map((document, i) => {
                      return (
                        <MenuItem key={i} value={document.label}>
                          {document.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Typography gutterBottom color='primary'>
                  Attachments
                </Typography>
                {/* <Input type='file' hidden dis/> */}
                {documentName !== '' && (
                  <DropzoneAreaBase
                    fileObjects={uploadedFiles.map((file) => ({
                      file,
                      data: null,
                    }))}
                    acceptedFiles={['application/pdf']}
                    onAdd={onFileAdd}
                    onDelete={onFileRemove}
                    filesLimit={6}
                    showFileNamesInPreview
                    clearOnUnmount
                    showFileNames
                    useChipsForPreview
                    // To prevent TSLint issue
                    Icon={(UploadIcon as unknown) as ReactElement}
                  />
                )}
                {documentName === '' && (
                  <Typography>Select a document type</Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleFileUploadDialogClose}
            variant='contained'
            color='primary'>
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Component to show the upload icon in the DropzoneArea
const UploadIcon = () => (
  <CloudUploadIcon color={'primary'} style={{ fontSize: '100px' }} />
);

export default DocumentUpload;
