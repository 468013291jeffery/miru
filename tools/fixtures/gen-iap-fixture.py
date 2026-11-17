#!/usr/bin/env python3
"""Generated test certificates only; no production trust overrides."""
import base64
import datetime
import json
from cryptography import x509
from cryptography.x509.oid import NameOID, ObjectIdentifier
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec

LEAF_OID = '1.2.840.113635.100.6.11.1'
CA_OID = '1.2.840.113635.100.6.2.1'
now = datetime.datetime.now(datetime.timezone.utc)

def make(name, issuer=None, issuer_key=None, ca=False, oid=None, expired=False, curve=None, wrong_issuer=False):
    key = ec.generate_private_key(curve or ec.SECP256R1())
    subject = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, name)])
    issuer_name = issuer.subject if issuer else subject
    if wrong_issuer:
        issuer_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Wrong issuer name')])
    start = now - datetime.timedelta(days=400) if expired else now - datetime.timedelta(minutes=2)
    builder = (x509.CertificateBuilder().subject_name(subject).issuer_name(issuer_name)
        .public_key(key.public_key()).serial_number(x509.random_serial_number())
        .not_valid_before(start).not_valid_after(start + datetime.timedelta(days=30 if expired else 365))
        .add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
        .add_extension(x509.KeyUsage(digital_signature=not ca, content_commitment=False,
            key_encipherment=False, data_encipherment=False, key_agreement=False,
            key_cert_sign=ca, crl_sign=ca, encipher_only=None, decipher_only=None), critical=True))
    if oid:
        builder = builder.add_extension(x509.UnrecognizedExtension(ObjectIdentifier(oid), b'\x05\x00'), critical=False)
    return key, builder.sign(issuer_key or key, hashes.SHA256())

def der(cert):
    return base64.b64encode(cert.public_bytes(serialization.Encoding.DER)).decode()

def pem(key):
    return key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()

root_key, root = make('Fixture Root', ca=True)
int_key, intermediate = make('Fixture App Store CA', root, root_key, ca=True, oid=CA_OID)
leaf_key, leaf = make('Fixture App Store signer', intermediate, int_key, oid=LEAF_OID)
expired_key, expired = make('Expired signer', intermediate, int_key, oid=LEAF_OID, expired=True)
wrong_leaf_key, wrong_leaf = make('Wrong purpose signer', intermediate, int_key)
wrong_int_key, wrong_int = make('Wrong purpose CA', root, root_key, ca=True)
wrong_int_leaf_key, wrong_int_leaf = make('Signer under wrong purpose CA', wrong_int, wrong_int_key, oid=LEAF_OID)
nonca_key, nonca = make('Not a CA', root, root_key, oid=CA_OID)
nonca_leaf_key, nonca_leaf = make('Signer under non-CA', nonca, nonca_key, oid=LEAF_OID)
wrong_issuer_key, wrong_issuer = make('Wrong issuer signer', intermediate, int_key, oid=LEAF_OID, wrong_issuer=True)
p384_key, p384 = make('Wrong curve signer', intermediate, int_key, oid=LEAF_OID, curve=ec.SECP384R1())

def case(key, cert, parent=intermediate):
    return {'leafDerB64': der(cert), 'leafKeyPem': pem(key), 'intermediateDerB64': der(parent)}

print(json.dumps({
    'rootDerB64': der(root), 'intermediateDerB64': der(intermediate),
    'leafDerB64': der(leaf), 'leafKeyPem': pem(leaf_key),
    'expiredLeafDerB64': der(expired), 'expiredLeafKeyPem': pem(expired_key),
    'wrongPurposeLeaf': case(wrong_leaf_key, wrong_leaf),
    'wrongPurposeIntermediate': case(wrong_int_leaf_key, wrong_int_leaf, wrong_int),
    'nonCAIntermediate': case(nonca_leaf_key, nonca_leaf, nonca),
    'wrongIssuer': case(wrong_issuer_key, wrong_issuer),
    'wrongCurve': case(p384_key, p384),
}))
