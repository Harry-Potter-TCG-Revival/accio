# Card Search Syntax Guide

To search for cards using various criteria, you can use the following prefixes and terms. Each prefix can be shortened to 1 to 3 letters for convenience.

## Basic Search

To perform a basic search, simply type your search term:

`Harry potter`

`common room`

`class`

This will search for the term within the *card names*.

## Advanced Search

To perform an advanced search, use the following prefixes:

- **Artist**: `artist`, `a`
- **Cost**: `cost`, `c`
- **Damage Each Turn**: `dmgeachturn`, `damage`, `dmg`
- **Effect**: `effect`, `e`
- **Flavor Text**: `flavortext`, `flavor`, `fl`
- **Health**: `health`, `h`
- **SubType or *Keyword***: `keyword`, `k`
- **Lesson**: `lesson`, `l`
- **Name**: `name`, `n`, `nm`
- **Note**: `note`
- **Number**: `number`, `num`
- **Prize**: `prize`, `p`
- **Provides Amount**: `provides.amount`, `providesamount`, `pa`
- **Provides Lesson**: `provides.lesson`, `provideslesson`, `pl`
- **Rarity**: `rarity`, `r`
- **Release Date**: `releasedate`, `date`, `d`
- **Reward**: `reward`, `re`
- **Set Name**: `setname`, `set`, `s`
- **To Solve**: `tosolve`, `solve`, `ts`
- **To Win**: `towin`, `tw`
- **Type**: `type`, `t`

## Combining Searches

You can combine searches using AND and OR (`|`) logic.

For example:

`weasley type:character`

Returns the `character` cards which contain `weasley` in the name.

This searches for cards that are `events` or `items`, and which are of type `charms` or `transfiguration`:

`type:event | type:item lesson:charms | lesson:transfiguration`

### Quoted Searches

If your search term includes spaces, use quotes:

`effect:"discard 2 cards"`

### Range Searches

The following numerical fields can be searched via ranges:

- **Cost**: `cost`, `c`
- **Damage Each Turn**: `dmgeachturn`, `damage`, `dmg`
- **Health**: `health`, `h`
- **Number**: `number`, `num`
- **Provides Amount**: `provides.amount`, `providesamount`, `pa`

Example:

`type:spell lesson:charms cost:>6 cost:<=9`

This search returns `charms spell` cards with a cost greater than 6 and less than or equal to 9.

## Example Usage

To search for a card by name:

`Albus Dumbledore` `albus dumbledore` `albus` `dumbledore` etc.

To search for cards with a specific type:

`type:character`

`t:spell`

To combine multiple search terms using AND logic (all conditions must be met):

`type:spell rarity:rare lesson:charms`

To combine multiple search terms using OR logic (any condition can be met):

`type:character | type:item`

Combining AND logic with OR logic in a single search:

`weasley t:adve | t:item`

This searches for cards which name match to `weasley` and are `adventures` or `items` only.

This guide should help you perform both basic and advanced searches effectively. Happy searching!
