import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// layouts
import CompactLayout from 'src/layouts/compact';
// assets
import { SeverErrorIllustration } from 'src/assets/illustrations';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varBounce } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function ErrorView({ error }) {
    return (
        <CompactLayout>
            <MotionContainer>
                <m.div variants={varBounce().in}>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                        {error?.message}
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                        There was an error, please try again later.
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                </m.div>

                <Button component={RouterLink} href="/" size="large" variant="contained">
                    Go to Home
                </Button>
            </MotionContainer>
        </CompactLayout>
    );
}

ErrorView.propTypes = {
    error: PropTypes.any,
};
