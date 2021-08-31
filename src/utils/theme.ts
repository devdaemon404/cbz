import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
  error: {
    main: '#b22d42',
  },
  secondary: {
    main: '#42668F',
    light: '#E1EBF2',
  },
  primary: {
    main: '#0d3c61',
    light: '#DCE3E8',
  },
};

const errorTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.error.main,
    },
    secondary: {
      main: colors.error.main,
    },
    error: {
      main: colors.error.main,
    },
    background: {
      default: '#fff',
    },
  },
});

const defaultTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
    },
    error: {
      main: colors.error.main,
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    /*MuiPickersToolbar: {
            toolbar: {
                backgroundColor: colors.primary.main,
            },
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                // backgroundColor: lightBlue.A200,
                // color: "white",
            },
        },
        MuiPickersDay: {
            day: {
                color: colors.primary.main,
            },
            daySelected: {
                backgroundColor: colors.primary.main,
            },
            dayDisabled: {
                color: colors.primary.main,
            },
            current: {
                color: colors.primary.main,
            },
        },
        MuiPickersModal: {
            dialogAction: {
                color: colors.primary.main,
            },
        },*/
    MuiTooltip: {
      popper: {
        marginTop: '-8px',
      },
      tooltip: {
        // fontFamily: "'Cabin', sans-serif",

        fontSize: '16px',
        backgroundColor: colors.primary.main,
        // boxShadow:
        //   'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
      },
    },
    /*MuiLink:{
            root: {
                color:'white'
            },
            underlineHover: {
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'none'
                }
            }
        },
        MuiButton:{
            root:{
                color:'white',
                textDecoration: 'none',
                backgroundColor: `${colors.primary.main}`,
                '&:hover': {
                    backgroundColor: `${colors.primary.main}`,
                }
            }
        },
        MuiButtonBase:{
            root:{
                color:'white',
                textDecoration: 'none',
                backgroundColor: `${colors.primary.main}`,
                '&:hover': {
                    backgroundColor: `${colors.primary.main}`,
                }
            }
        },*/
    MuiOutlinedInput: {
      root: {
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: `${colors.secondary.main}`,
        },
        '&:hover:not($disabled):not($focused):not($error) $input': {
          color: `${colors.secondary.main}`,
        },
        '&$focused:not($disabled):not($error) $notchedOutline': {
          borderColor: `${colors.secondary.main}`,
        },
        '&$focused:not($disabled):not($error) $input': {
          color: `${colors.secondary.main}`,
        },
      },
      notchedOutline: {
        borderColor: `${colors.primary.main}`,
        '&$input': {
          color: `${colors.primary.main}`,
        },
      },
    },
    MuiInputBase: {
      root: {
        color: `${colors.secondary.main}`,
      },
    },
    /*MuiDialog:{
            paper:{
                minHeight: '70vh',
                maxHeight: '80vh',
            }
        },*/
    MuiInput: {
      input: {
        /*'&$error':{
                    color: `${colors.error.main}`,
                }*/
      },
      /*error:{
                input:{
                    color: `${colors.error.main}`
                }
            },*/
      root: {
        '&:not($error):hover': {
          color: `${colors.secondary.main}`,
        },
        '&$error': {
          color: `${colors.error.main}`,
        },
        '&:not($error)': {
          color: `${colors.secondary.main}`,
        },
      },
      underline: {
        borderBottomColor: `${colors.primary.main}`,
        '&:not($error):hover': {
          '&:before': {
            borderBottomColor: `${colors.secondary.main}`,
          },
          '&:after': {
            borderBottomColor: `${colors.secondary.main}`,
          },
        },
        '&$error': {
          '&:before': {
            borderBottomColor: `${colors.error.main} !important`,
            '&:hover': {
              borderBottomColor: `${colors.error.main} !important`,
            },
          },
          '&:after': {
            borderBottom: `1px solid ${colors.error.main} !important`,
            '&:hover': {
              borderBottomColor: `${colors.error.main} !important`,
            },
          },
          '&$focused': {
            '&:before': {
              borderBottomColor: `${colors.error.main} !important`,
            },
            '&:after': {
              transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
              borderBottom: `2px solid ${colors.error.main} !important`,
            },
          },
        },
        /*'&$error:not($disabled):$focused:before': {
                    borderBottom: `.5px solid ${colors.error.main}`
                },
                '&$error:not($disabled):$focused:after': {
                    borderBottom: `1px solid ${colors.error.main}`
                },*/
        '&:not($error):before': {
          borderBottomColor: `${colors.primary.main}`,
        },
        '&:not($error):after': {
          borderBottomColor: `${colors.secondary.main}`,
        },
        '&:hover:not($error):before': {
          borderBottomColor: `${colors.secondary.main}`,
        },
        '&:hover:not($error):after': {
          borderBottomColor: `${colors.secondary.main}`,
        },
        '&&&&:hover:not($error):before': {
          borderBottomColor: `${colors.secondary.main}`,
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottomColor: `${colors.secondary.main}`,
        },
      },
    },
    MuiFilledInput: {
      root: {
        color: `${colors.secondary.main}`,
      },
    },
    MuiInputLabel: {
      root: {
        color: `${colors.primary.main}`,
        '&:not($error):hover': {
          color: `${colors.secondary.main}`,
        },
        '&$error:hover': {
          color: `${colors.error.main}`,
        },
        '&$focused': {
          '&$error': {
            color: `${colors.error.main}`,
          },
          '&:not($error)': {
            color: `${colors.secondary.main}`,
          },
          /*'&:hover': {
                        color: `${colors.secondary.main}`
                    }*/
        },
      },
      filled: {
        '&$error': {
          color: `${colors.error.main}`,
        },
        '&$error:hover': {
          color: `${colors.error.main}`,
        },
        color: `${colors.secondary.main}`,
        /*underline: {
                    '&:not($error):before': {
                        borderBottomColor: `${colors.primary.main}`
                    },
                    '&:not($error):after': {
                        borderBottomColor: `${colors.secondary.main}`
                    },
                    /!*'$focused:&$error:after': {
                        borderBottomColor: `${colors.error.main}`,
                    },*!/
                }*/
      },
    },
    MuiFormLabel: {
      root: {
        color: `${colors.primary.main}`,
        fontFamily: "'Cabin', sans-serif",
        /*fontFamily: "'Crimson Pro', serif",*/
        fontWeight: 700,
        fontSize: 13,
        '&:not($error):hover': {
          color: `${colors.secondary.main}`,
        },
        '&$error:hover': {
          color: `${colors.error.main}`,
        },
        '&$focused': {
          '&$error': {
            color: `${colors.error.main}`,
          },
          '&:not($error)': {
            color: `${colors.secondary.main}`,
          },
          /*'&:not($error):hover': {
                        color: `${colors.secondary.main}`
                    }*/
        },
      },
      filled: {
        '&:not($error)': {
          color: `${colors.secondary.main}`,
        },
      },
    },
    MuiFormHelperText: {
      root: {
        position: 'absolute',
        bottom: -18,
      },
    },
    MuiFormControl: {
      marginNormal: {
        marginTop: 21,
      },
    },
    MuiFormControlLabel: {
      root: {
        color: `${colors.primary.main}`,
        '&:active': {
          color: `${colors.secondary.main}`,
          '&:hover': {
            color: `${colors.primary.main}`,
          },
        },
        filled: {
          color: `${colors.secondary.main}`,
          '&:hover': {
            color: `${colors.primary.main}`,
          },
        },
      },
      label: {
        /*"&$checked": {
                    color: `${colors.secondary.main}`,
                    '&:hover': {
                        color: `${colors.primary.main}`
                    }
                },*/
      },
    },
    MuiCheckbox: {
      root: {
        color: `${colors.primary.main}`,
        '&:hover': {
          color: `${colors.secondary.main}`,
        },
        '&$checked': {
          color: `${colors.secondary.main} !important`,
          '&:hover': {
            color: `${colors.primary.main} !important`,
          },
          MuiFormControlLabel: {
            color: `${colors.secondary.main} !important`,
            label: {
              color: `${colors.secondary.main} !important`,
              '&:hover': {
                color: `${colors.primary.main} !important`,
              },
            },
          },
        },
      },
    },
  },
});

export default defaultTheme;

export { errorTheme, defaultTheme };
