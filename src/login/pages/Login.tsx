/**
 * Combined Username + Password login page (login.ftl) with optional WebAuthn passkey support.
 * Renders standard login form plus conditional passkey authenticator section.
 */
import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import { Button, Form, FormGroup, FormHelperText, HelperText, HelperTextItem, InputGroup, InputGroupItem, TextInput } from "@patternfly/react-core";
import RhUiErrorFillIcon from "@patternfly/react-icons/dist/esm/icons/rh-ui-error-fill-icon";
import RhUiViewFillIcon from "@patternfly/react-icons/dist/esm/icons/rh-ui-view-fill-icon";
import RhUiViewOffFillIcon from "@patternfly/react-icons/dist/esm/icons/rh-ui-view-off-fill-icon";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            {realm.password && (
                <Form
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                >
                    {!usernameHidden && (
                        <FormGroup
                            label={
                                !realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")
                            }
                        >
                            <TextInput
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                autoFocus
                                autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                validated={messagesPerField.existsError("username", "password") ? "error" : "default"}
                            />
                            {messagesPerField.existsError("username", "password") && (
                                <FormHelperText>
                                    <HelperText>
                                        <HelperTextItem id="input-error" icon={<RhUiErrorFillIcon />} variant="error" aria-live="polite">
                                            {messagesPerField.getFirstError("username", "password")}
                                        </HelperTextItem>
                                    </HelperText>
                                </FormHelperText>
                            )}
                        </FormGroup>
                    )}

                    <FormGroup label={msg("password")}>
                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                            <TextInput
                                tabIndex={3}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                validated={messagesPerField.existsError("username", "password") ? "error" : "default"}
                            />
                        </PasswordWrapper>
                        {usernameHidden && messagesPerField.existsError("username", "password") && (
                            <FormHelperText>
                                <HelperText>
                                    <HelperTextItem id="input-error" icon={<RhUiErrorFillIcon />} variant="error" aria-live="polite">
                                        {messagesPerField.getFirstError("username", "password")}
                                    </HelperTextItem>
                                </HelperText>
                            </FormHelperText>
                        )}
                    </FormGroup>

                    <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                        <div id="kc-form-options">
                            {realm.rememberMe && !usernameHidden && (
                                <div className="checkbox">
                                    <label>
                                        <input tabIndex={5} id="rememberMe" name="rememberMe" type="checkbox" defaultChecked={!!login.rememberMe} />{" "}
                                        {msg("rememberMe")}
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            {realm.resetPasswordAllowed && (
                                <span>
                                    <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                        {msg("doForgotPassword")}
                                    </a>
                                </span>
                            )}
                        </div>
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                        <Button
                            tabIndex={7}
                            disabled={isLoginButtonDisabled}
                            // className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                            variant="primary"
                            name="login"
                            id="kc-login"
                            type="submit"
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </div>
                </Form>
            )}
            {enableWebAuthnConditionalUI && (
                <>
                    <form id="webauth" action={url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input type="hidden" id="authenticatorData" name="authenticatorData" />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </form>

                    {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                        <>
                            <form id="authn_select" className={kcClsx("kcFormClass")}>
                                {authenticators.authenticators.map((authenticator, i) => (
                                    <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                                ))}
                            </form>
                        </>
                    )}
                    <br />

                    <input
                        id={webAuthnButtonId}
                        type="button"
                        className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        value={msgStr("passkey-doAuthenticate")}
                    />
                </>
            )}
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <InputGroup>
            <InputGroupItem>{children}</InputGroupItem>
            <InputGroupItem>
                <Button
                    variant="control"
                    aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                    aria-controls={passwordInputId}
                    icon={isPasswordRevealed ? <RhUiViewOffFillIcon /> : <RhUiViewFillIcon />}
                    onClick={toggleIsPasswordRevealed}
                    tabIndex={4}
                />
            </InputGroupItem>
        </InputGroup>
    );
}
