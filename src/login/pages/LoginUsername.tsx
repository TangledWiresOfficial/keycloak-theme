import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import SocialProvidersNode from "../components/SocialProvidersNode";
import { Button, Checkbox, Form, FormGroup, FormHelperText, HelperText, HelperTextItem, TextInput } from "@patternfly/react-core";
import RhUiErrorFillIcon from "@patternfly/react-icons/dist/esm/icons/rh-ui-error-fill-icon";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { realm, url, usernameHidden, login, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
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
            displayMessage={!messagesPerField.existsError("username")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration">
                    <span>
                        {msg("noAccount")}{" "}
                        <a tabIndex={6} href={url.registrationUrl}>
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("doLogIn")}
            socialProvidersNode={<SocialProvidersNode kcContext={kcContext} doUseDefaultCss={doUseDefaultCss} classes={classes} />}
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
                                type="text"
                                autoFocus
                                autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                                aria-invalid={messagesPerField.existsError("username")}
                                validated={messagesPerField.existsError("username") ? "error" : "default"}
                            />
                            {messagesPerField.existsError("username") && (
                                <FormHelperText>
                                    <HelperText>
                                        <HelperTextItem id="input-error" icon={<RhUiErrorFillIcon />} variant="error" aria-live="polite">
                                            {messagesPerField.getFirstError("username")}
                                        </HelperTextItem>
                                    </HelperText>
                                </FormHelperText>
                            )}
                        </FormGroup>
                    )}

                    <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                        <div id="kc-form-options">
                            {realm.rememberMe && !usernameHidden && (
                                <FormGroup>
                                    <Checkbox
                                        tabIndex={3}
                                        id="rememberMe"
                                        name="rememberMe"
                                        defaultChecked={!!login.rememberMe}
                                        label={msg("rememberMe")}
                                    />
                                </FormGroup>
                            )}
                        </div>
                    </div>

                    <FormGroup id="kc-form-buttons">
                        <Button tabIndex={4} disabled={isLoginButtonDisabled} variant="primary" name="login" id="kc-login" type="submit" isBlock>
                            {msgStr("doLogIn")}
                        </Button>
                    </FormGroup>
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

                    <Button
                        id={webAuthnButtonId}
                        variant="secondary"
                        className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        isBlock
                    >
                        {msgStr("passkey-doAuthenticate")}
                    </Button>
                </>
            )}
        </Template>
    );
}
