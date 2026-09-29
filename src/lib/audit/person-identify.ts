/**
 * The free first step of the person check: can an assistant tell who this is
 * from the profile address alone?
 *
 * The person pastes one link and types nothing else. Everything the paid run
 * needs, the name, the role, the company and the field, has to come out of
 * this one question. When the assistant cannot tell, that is shown as it is:
 * nobody is charged for a run about a person no model could identify.
 */

import type { SocialProfile } from "./social-profile";

export const IDENTIFY_FACT_ID = "identify";

export function buildIdentifyQuestion(profile: SocialProfile): string {
  return (
    `Whose ${profile.networkLabel} profile is ${profile.url} ? ` +
    "Give the person's full name, their professional role today, the company or project they are connected to, " +
    "and the field they work in, in a few words. " +
    "If you cannot tell who this is, say so plainly and do not guess."
  );
}
