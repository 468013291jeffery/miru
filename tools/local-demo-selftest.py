import os, pathlib, subprocess, sys, tempfile, unittest
SCRIPT=pathlib.Path(__file__).resolve().parents[1]/"source/mk_local.py"
class LocalDemoTest(unittest.TestCase):
 def test_missing_key_fails_before_output(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d);(p/"index.html").write_text("<html><script>app()</script></html>")
   env=dict(os.environ);env.pop("LONGCAT_API_KEY",None)
   r=subprocess.run([sys.executable,str(SCRIPT),"--input",str(p/"index.html"),"--output",str(p/"demo.html")],env=env,cwd=d,capture_output=True,text=True)
   self.assertNotEqual(r.returncode,0);self.assertIn("LONGCAT_API_KEY",r.stderr);self.assertFalse((p/"demo.html").exists())
 def test_key_is_only_in_requested_local_output(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d);(p/"index.html").write_text("<html><script>app()</script></html>")
   env=dict(os.environ,LONGCAT_API_KEY="local-test-value</script>")
   r=subprocess.run([sys.executable,str(SCRIPT),"--input",str(p/"index.html"),"--output",str(p/"demo.html")],env=env,cwd=d,capture_output=True,text=True)
   self.assertEqual(r.returncode,0,r.stderr);out=(p/"demo.html").read_text()
   self.assertIn("local-test-value",out);self.assertNotIn("local-test-value</script>",out);self.assertEqual((p/"index.html").read_text(),"<html><script>app()</script></html>")
if __name__=="__main__":unittest.main()
