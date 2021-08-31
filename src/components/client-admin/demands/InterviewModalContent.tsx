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
import InterviewRound from './InterviewRound';
import InterviewNewRound from './InterviewNewRound';
import PMInterviewContext from 'src/contexts/project-manager/interview/pm-interview-context';
import { InterviewSlotInformationType } from 'src/types/project-manager/demand';
import { withStyles } from '@material-ui/styles';
import OPLoader from 'src/components/common/OPLoader';
import InterviewNewRoundModal from './InterviewNewRoundModal';

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
  slotRejectionRaised,
  // profileStatus,
  closeInterviewModal,
}: {
  // profileStatus: string;
  slotRejectionRaised: boolean;
  closeInterviewModal: () => void;
}) => {
  const classes = useStyles();
  // Context Interview
  const { interviewRounds } = useContext(PMInterviewContext);
  // Currently selected round in a interview (UI).
  const [currentRound, setCurrentRound] = useState(interviewRounds.length);

  const [newRoundModalOpened, setNewRoundModalOpened] = useState<boolean>(
    false,
  );

  const [statusForNewModal, setStatusForNewModal] = useState('');
  // Whenever we set a next round requested if there are some rounds ,if last round's status is NEXT_ROUND_REQUIRED.
  useEffect(() => {
    if (interviewRounds.length > 0) {
      const round = interviewRounds[interviewRounds.length - 1];
      if (round.status === 'NEXT_ROUND_REQUIRED' || slotRejectionRaised) {
        setNewRoundModalOpened(true);
      }
    }
  }, []);

  return (
    <div>
      <DialogContent dividers>
        <Grid container spacing={1} direction='column'>
          <Grid item>
            <Typography variant='body1' color='initial'>
              Interview Round
            </Typography>

            {interviewRounds.length === 0 ? (
              <Button
                variant='contained'
                color='inherit'
                className={classes.roundButton}
                size='small'>
                New Round
              </Button>
            ) : (
              interviewRounds.map((interviewRound) => {
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
              })
            )}
          </Grid>
          {interviewRounds.length ? (
            interviewRounds.map((interviewRound, index) => {
              if (interviewRound.round === currentRound) {
                return (
                  <InterviewRound
                    interviewRound={interviewRound}
                    isLastRound={index + 1 === interviewRounds.length}
                    openNewRoundModal={(status) => {
                      setStatusForNewModal(status);
                      setNewRoundModalOpened(true);
                    }}
                    closeInterviewModal={closeInterviewModal}
                  />
                );
              }
            })
          ) : (
            <InterviewNewRound slotRejectionRaised={slotRejectionRaised} />
          )}
        </Grid>
      </DialogContent>

      <InterviewNewRoundModal
        // profileStatus={profileStatus}
        slotRejectionRaised={slotRejectionRaised}
        status={statusForNewModal}
        isOpen={newRoundModalOpened}
        onClose={async () => {
          await setNewRoundModalOpened(false);
        }}
      />
    </div>
  );
};

export default InterviewModalContent;
