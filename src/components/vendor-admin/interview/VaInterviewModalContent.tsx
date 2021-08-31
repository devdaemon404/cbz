import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  Grid,
  Typography,
  DialogContent as MuiDialogContent,
  Theme,
  makeStyles,
} from '@material-ui/core';
import 'moment-timezone';
import InterviewRound from './VaInterviewRound';
import { InterviewSlotInformationType } from 'src/types/project-manager/demand';
import { withStyles } from '@material-ui/styles';
import VADemandContext from 'src/contexts/vendor-admin/demand/va-demand-context';
import VAInterviewContext from 'src/contexts/vendor-admin/interview/va-interview-context';
// import InterviewNewRoundModal from './InterviewNewRoundModal';

const useStyles = makeStyles((theme: Theme) => ({
  roundButton: {
    borderRadius: '40px',
    marginTop: theme.spacing(1),
  },
  buttonMargin: {
    margin: theme.spacing(2, 0),
  },
}));

const interviewRoundDefaultValue: InterviewSlotInformationType = {
  times: [],
  round: 0,
  selectedSlotId: '',
  notes: '',
  interview_mode: '',
  round_description: '',
  status: '',
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const InterviewModalContent = ({
  // profileIndex,
  role,
  closeInterviewModal,
}: {
  role: string;
  // profileIndex: number;
  closeInterviewModal: () => void;
}) => {
  const classes = useStyles();
  // Context Interview
  const { currentProfile } = useContext(VAInterviewContext);
  // console.log('Profiles: ', profiles);
  const profile = currentProfile;
  console.log('Current Profile: ', profile);
  const interviewSlotsArr = profile!.interviewSlotsArr;
  const [currentRound, setCurrentRound] = useState(interviewSlotsArr.length);

  // if (profiles.length === 0) {
  //   return <>No list</>;
  // } else {
  return (
    <div>
      <DialogContent dividers>
        <Grid container spacing={1} direction='column'>
          <Grid item>
            {interviewSlotsArr?.length === 0 ? (
              <></>
            ) : (
              <>
                <Typography variant='body1' color='initial'>
                  Interview Round
                </Typography>
                {interviewSlotsArr?.map((interviewRound) => {
                  return (
                    <Button
                      variant='contained'
                      color={
                        interviewRound.round === currentRound
                          ? 'primary'
                          : 'inherit'
                      }
                      className={classes.roundButton}
                      size='small'
                      onClick={() => setCurrentRound(interviewRound.round)}>
                      Round {interviewRound.round}
                    </Button>
                  );
                })}
              </>
            )}
          </Grid>
          {interviewSlotsArr?.length ? (
            interviewSlotsArr?.map((interviewRound, index) => {
              if (interviewRound.round === currentRound) {
                return (
                  <InterviewRound
                    // profileIndex={profileIndex}
                    role={role}
                    interviewRound={interviewRound}
                    isLastRound={index + 1 === interviewSlotsArr.length}
                    closeInterviewModal={closeInterviewModal}
                  />
                );
              }
            })
          ) : (
            <>
              <Typography variant='body1' color='initial'>
                Start the interview first
              </Typography>
            </>
          )}
          {/* <InterviewRound /> */}
        </Grid>
      </DialogContent>
    </div>
  );
};
// };

export default InterviewModalContent;
