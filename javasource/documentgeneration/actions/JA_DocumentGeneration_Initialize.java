// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
// Special characters, e.g., é, ö, à, etc. are supported in comments.

package documentgeneration.actions;

import com.mendix.core.Core;
import com.mendix.logging.ILogNode;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.webui.CustomJavaAction;
import documentgeneration.implementation.DocGenRequestHandler;
import documentgeneration.implementation.DocumentGenerator;
import documentgeneration.implementation.LocalServiceLocator;
import documentgeneration.implementation.Logging;

public class JA_DocumentGeneration_Initialize extends CustomJavaAction<java.lang.Boolean>
{
	public JA_DocumentGeneration_Initialize(IContext context)
	{
		super(context);
	}

	@java.lang.Override
	public java.lang.Boolean executeAction() throws Exception
	{
		// BEGIN USER CODE
		Core.addRequestHandler(DocGenRequestHandler.ENDPOINT, new DocGenRequestHandler());
		logging.info("Added document generation request handler");

		if (DocumentGenerator.isLocalDevelopmentEnvironment())
			LocalServiceLocator.verify();
		
		return true;
		// END USER CODE
	}

	/**
	 * Returns a string representation of this action
	 * @return a string representation of this action
	 */
	@java.lang.Override
	public java.lang.String toString()
	{
		return "JA_DocumentGeneration_Initialize";
	}

	// BEGIN EXTRA CODE
	private static final ILogNode logging = Logging.logNode;
	// END EXTRA CODE
}
