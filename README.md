# Wizard Score Keeper

Play the famous Wizard card game and take down your guesses and results online.
The score keeper will check your entries for validity and calculate your scores for
reach round. 

Visit at https://www.wizard-score-keeper.app/

## Dependencies

This project must not make use of any runtime dependencies.

## Code Structure

[src/js/domain](src/js/domain) Domain objects of the Game aggregate boundary. The aggregate root `Game` is the starting point and
provides the public interface into the domain.

[src/js/ui](src/js/ui) UI Elements, basically CustomElements. `ScoreKeeperComponent` / `<wizard-score-keeper></wizard-score-keeper>`
is the main bootstrapping component.

[src/js/lib](src/js/lib) Collection of "utilities", e.g. helpers for dealing with data structures.

## Testing

One of the few dev dependencies is jest. Jest configuration is located at [jest.config.mjs](jest.config.mjs), test setup can be found
at [test-setup.js](test-setup.js). Test files are suffixed with `.spec.js`.
